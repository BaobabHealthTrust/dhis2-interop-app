import axios from "axios";

import settings from "../../settings";

export default class OpenHimData {
  constructor() {
    const {
      OPENHIM_URL: URL,
      OPENHIM_PASSWORD: password,
      OPENHIM_USER: username
    } = settings;

    this.url = URL;
    this.auth = { password, username };
  }

  async fetchSynchronization() {
    const url = `${this.url}/interop-manager/synchronizations`;

    const facilities = await axios({
      method: "get",
      url,
      auth: this.auth,
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log(err));

    const data = facilities ? facilities.data : [];
    return data;
  }

  async fetchChangedFacilities() {
    const url = `${this.url}/interop-manager/changedFacilities`;

    const facilities = await axios({
      method: "get",
      url,
      auth: this.auth,
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log(err));

    const data = facilities ? facilities.data : [];
    return data;
  }
}
