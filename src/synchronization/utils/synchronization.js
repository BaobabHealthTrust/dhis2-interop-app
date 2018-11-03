import axios from "axios";

import settings from "../../settings";

export default class Synchronization {

  async fetchFacilities() {

    const {
      openHimURL: URL,
      openHimPassword: password,
      openHimUser: username
    } = settings

    const url = `${URL}/interop-manager/changedFacilities`;

    const facilities = await axios({
      method: "get",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json"}
    }).catch(err => console.log(err));

    this.facilities = facilities.data;
  }

  async syncFacilities(facilities) {
    for (let facility of facilities) {
      const { isRecent, isRemoved } = facility;

      if (isRecent) {
        const preparedFacility = await this.prepareFacility(facility);
        await this.addFacility(preparedFacility);
        continue;
      }

      if (isRemoved) {
        const code = facility.DHIS2Code.newValue
        const id = await this.findDHIS2Facility(code);
        await this.deleteFacility(id);
        continue;
      }

      if (!isRecent && !isRemoved) {
        const preparedFacility = await this.prepareFacility(facility);
        const { code = null } = preparedFacility
        console.log(code," : ", preparedFacility.name, " : " , preparedFacility.parent.name);
        const id = await this.findDHIS2Facility(code);
        // if(id) await this.updateFacility(preparedFacility, id)
      }
    }
  }

  async findDHIS2Facility(code) {

    const {
      dhis2URL: URL,
      dhis2User: username,
      dhis2Password: password
    } = settings

    const url = `${URL}/training/api/organisationUnits.json?filter=code:eq:${code}&fields=id`

    const req = await axios({
      method: "get",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log(err));

    const { organisationUnits } = req.data;
    const [ id ] = organisationUnits;
    return id ? id.id : null
  }

  preparedFacilityCode(code){
    let buffer = code
    buffer = (buffer.length == 1) ? `000${buffer}` : buffer
    buffer = (buffer.length == 2) ? `00${buffer}` : buffer
    buffer = (buffer.length == 3) ? `0${buffer}` : buffer
    return buffer
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
    }
  }

  async updateFacility(facility, id) {
    // hit the DHIS2 update endpoint with the facility and id

    const {
      dhis2URL: URL,
      dhis2User: username,
      dhis2Password: password
    } = settings;

    const name = facility.parent.name

    console.log("facility: ", name, id);
    let url = `${URL}/training/api/organisationUnits.json?filter=name:eq:${name}&fields=id`
    let req = await axios({
      method: "get",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log(err));

    const { organisationUnits } = req.data;
    const [ parentId ] = organisationUnits;

    url = `${URL}/training/api/28/organisationUnits/${id}`;

    const data = {
      name: facility.name,
      code: facility.code,
      shortName: facility.shortName,
      openingDate: facility.openingDate,
      parent: {
        name: facility.parent.name,
        id: parentId.id
      }
    }

    console.log(data)

    // req = await axios({
    //   method: "PUT",
    //   url,
    //   auth: { username, password },
    //   headers: { "Content-Type": "application/json" },
    //   data,
    // }).catch(err => console.log(err));

    // console.log(req)
  }

  async addFacility(facility) {
    // hit the DHIS2 add endpoint with the facility

    const res = await fetch(
      `http://192.168.2.252:7000/training/api/organisationUnits.json?filter=name:ilike:${
      facility.parent.name
      }&fields=[id]`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(":/")}`
        }
      }
    );
    // console.log(await res.json());
    const data = await res.json();
    // console.clear();
    // console.log(data.organisationUnits);
    facility.parent.id = data.organisationUnits[0].id;
    await fetch(
      "http://192.168.2.252:7000/training/api/28/organisationUnits",
      {
        method: "POST",
        body: JSON.stringify(facility),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("")}`
        }
      }
    );
  }

  async deleteFacility(id) {
    // hit delete endpoint with the id
  }

}
