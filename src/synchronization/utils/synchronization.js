import axios from "axios";

class Synchronization {
  async fetchFacilities() {
    const facilities = await axios({
      method: "get",
      url: "http://142.93.203.254:5001/interop-manager/changedFacilities",
      auth: {
        username: "mhfr",
        password: "mhfr"
      }
    });

    this.facilities = facilities.data;
  }

  async syncFacilities(facilities) {
    for (let facility of facilities) {
      const { isRecent, isRemoved } = facility;

      if (isRecent) {
        await this.addFacility();
        continue;
      }

      if (isRemoved) {
        await this.deleteFacility();
        continue;
      }

      if (!isRecent && !isRemoved) {
      }
    }
  }

  async updateFacility() {}
  async addFacility() {}
  async deleteFacility() {}
}

export default Synchronization;
