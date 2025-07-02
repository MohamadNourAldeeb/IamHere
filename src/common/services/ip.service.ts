import { Injectable } from "@nestjs/common";
import * as os from "os";
@Injectable()
export class IpService {
  async getServerIp(): Promise<Object> {
    const interfaces = os.networkInterfaces();
    return interfaces["Wi-Fi"][0].address;
  }
}
