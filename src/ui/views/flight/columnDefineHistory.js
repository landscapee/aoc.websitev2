/**
 *
 * 针对columnDefine的增量 只用在航班历史
 * */
import {displayTimeDate} from "@/lib/helper/utility";
export default {
  displayPreOrNxtPlanTime: {
    formatter: (data) => {
      return displayTimeDate(data['preOrNxtPlanTime'])
    },
  },
  displayPreOrNxtActualTime: {
    formatter: (data) => {
      return displayTimeDate(data.preOrNxtActualTime);
    },
  },
}
