import { providers } from "ethers";
import { HostingPayment__factory } from "./HostingPayment__factory";
import { ERC20__factory } from "./ERC20__factory";

export const paymentAddress = "0x526210781b9B6CA708274E58D277FB150ffE8D6a";

export function getClient() {
  const provider = new providers.Web3Provider(window.ethereum);
  const payment = HostingPayment__factory.connect(paymentAddress, provider);

  const erc20 = (address) => {
    return ERC20__factory.connect(address, provider);
  };

  return { payment, erc20, provider };
}
