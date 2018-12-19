import axios from "axios";

import settings from "../../settings";

export default class Synchronization {
  async fetchFacilities() {
    const {
      OPENHIM_URL: URL,
      OPENHIM_PASSWORD: password,
      OPENHIM_USER: username
    } = settings;

    const url = `${URL}/interop-manager/changedFacilities`;

    const facilities = await axios({
      method: "get",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log(err));

    this.facilities = facilities.data;
  }

  async syncFacilities(facilities) {
    let totalFacilitiesAdded = 0;
    let totalFacilitiesRemoved = 0;
    let totalFacilitiesUpdated = 0;

    for (let facility of facilities) {
      if (!facility.DHIS2Code.newValue) {
        console.log(
          "No DHIS2 code for facility: ",
          JSON.stringify(facility, undefined, 2)
        );
        continue;
      }
      const code = this.preparedFacilityCode(facility.DHIS2Code.newValue);

      const preparedFacility = {
        name: facility.Name.newValue,
        shortName: facility.Name.newValue,
        code,
        openingDate: facility.DateOpened.newValue
      };

      const { isRecent, isRemoved } = facility;

      if (isRemoved) {
        const id = await this.findDHIS2Facility(code);
        await this.deleteFacility(id);
        totalFacilitiesRemoved += 1;
        continue;
      }

      if (isRecent) {
        preparedFacility.parent = {
          name: `${facility.District.newValue.replace(/ /g, "-")}-DHO`
        };
        await this.addFacility(preparedFacility);
        totalFacilitiesUpdated += 1;
        continue;
      }

      if (!isRecent && !isRemoved) {
        const id = await this.findDHIS2Facility(code);
        if (!id) {
          console.log(
            "No id for facility",
            JSON.stringify(preparedFacility, undefined, 2)
          );
        } else await this.updateFacility(preparedFacility, id);
        totalFacilitiesUpdated += 1;
      }
    }

    const {
      OPENHIM_URL: URL,
      OPENHIM_PASSWORD: password,
      OPENHIM_USER: username
    } = settings;

    const data = {
      totalFacilitiesAdded,
      totalFacilitiesRemoved,
      totalFacilitiesUpdated,
      isSuccessful: true,
      facilities
    };

    const url = `${URL}/interop-manager/synchronizations`;

    const res = await axios({
      method: "POST",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" },
      data
    }).catch(err => console.log(err));

    return res.data;
  }

  async findDHIS2Facility(code) {
    const {
      DHIS2_URL: URL,
      DHIS2_USER: username,
      DHIS2_PASSWORD: password
    } = settings;

    const url = `${URL}/api/organisationUnits.json?filter=code:eq:${code}&fields=id`;

    const req = await axios({
      method: "get",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log("error2", err));

    const { organisationUnits } = req.data;
    const [id] = organisationUnits;
    return id ? id.id : null;
  }

  preparedFacilityCode(code) {
    let buffer = code;
    buffer = buffer.length == 1 ? `000${buffer}` : buffer;
    buffer = buffer.length == 2 ? `00${buffer}` : buffer;
    buffer = buffer.length == 3 ? `0${buffer}` : buffer;
    return buffer;
  }

  prepareFacility(facility) {
    const code = this.preparedFacilityCode(facility.DHIS2Code.newValue);

    return {
      name: facility.Name.newValue,
      shortName: facility.Name.newValue,
      code,
      openingDate: facility.DateOpened.newValue,
      parent: {
        name: `${facility.District.newValue.replace(/ /g, "-")}-DHO`
      }
    };
  }

  async updateFacility(facility, id) {
    const {
      DHIS2_URL: URL,
      DHIS2_USER: username,
      DHIS2_PASSWORD: password
    } = settings;

    const url = `${URL}/api/28/organisationUnits/${id}`;

    const req = await axios({
      method: "PATCH",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" },
      data: facility
    }).catch(err => console.log(err));

    console.log(url);
    const logMessage = req
      ? "Facility synchronizationed successfully"
      : "Facility failed to be synchronizationed";

    console.log(`${logMessage}: `, JSON.stringify(facility, undefined, 2));
  }

  async addFacility(facility) {
    const {
      DHIS2_URL: URL,
      DHIS2_USER: username,
      DHIS2_PASSWORD: password
    } = settings;

    const name = facility.parent.name;

    let url = `${URL}/api/organisationUnits.json?filter=name:eq:${name}&fields=id`;

    let req = await axios({
      method: "get",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log(err));

    if (!req) return;

    const { organisationUnits } = req.data;
    const [parentId] = organisationUnits;

    const data = { ...facility };
    data.parent.id = parentId.id;

    url = `${URL}/api/28/organisationUnits`;

    req = await axios({
      method: "POST",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" },
      data
    }).catch(err => console.log(err));
  }

  async deleteFacility(id) {
    const {
      DHIS2_URL: URL,
      DHIS2_USER: username,
      DHIS2_PASSWORD: password
    } = settings;

    const url = `${URL}/api/28/organisationUnits/${id}`;

    const req = await axios({
      method: "PATCH",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" },
      data: { closeDate: new Date() }
    }).catch(err => console.log(err));

    console.log(url);
    const logMessage = req
      ? "Facility deleted successfully"
      : "Facility failed to be deleted";

    console.log(logMessage);
  }
}
