import { providers } from "ethers";
import { HostingPayment__factory } from "./HostingPayment__factory";
import { ERC20__factory } from "./ERC20__factory";

export const paymentAddress = "0x4663B1fC1180B28D9D158E79FD87830477dBAdD6";

export function getClient() {
  const provider = new providers.Web3Provider(window.ethereum);
  const payment = HostingPayment__factory.connect(paymentAddress, provider);

  const erc20 = (address) => {
    return ERC20__factory.connect(address, provider);
  };

  return { payment, erc20, provider };
}
