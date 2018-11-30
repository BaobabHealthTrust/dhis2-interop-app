import { DHAMIS } from "./DHAMIS";
import Default from "./Default";
export default system => {
  if (system === "DHAMIS") return DHAMIS;
  else return Default;
};
