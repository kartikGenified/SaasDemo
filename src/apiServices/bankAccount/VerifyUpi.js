import axios from "axios";
import { HostUrl } from "../../utils/HostUrl";
import * as Keychain from 'react-native-keychain';


const VerifyUpi=async(data)=>{

    const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    axios.get(HostUrl+`/payout/v1/validation/upiDetails?vpa=`+data,{headers:{
        "Authorization": `Bearer ${token}`,
    }}).then((res)=>{console.log("verify upi response",res.data)})
  }

    
}

export default VerifyUpi