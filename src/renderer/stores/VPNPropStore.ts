import { action, computed, makeObservable, observable } from 'mobx';

interface VPNProperties {
  country: string;
  primaryProtocol: string;
  secondaryProtocol: string;
  tertiaryProtocol: string;

  useOptimization: boolean;
  useSmartDialing: boolean;
  useSplitTunneling: boolean;
  doCheckInternetConnectivity: boolean;
  enableDNSLeakProtection: boolean;
  enableIPv6LeakProtection: boolean;
}

export class VPNPropertiesImpl {
  vpnProps: VPNProperties = {
    country: '',
    primaryProtocol: '',
    secondaryProtocol: '',
    tertiaryProtocol: '',

    useOptimization: false,
    useSmartDialing: false,
    useSplitTunneling: false,
    doCheckInternetConnectivity: false,
    enableDNSLeakProtection: false,
    enableIPv6LeakProtection: false,
  };

  constructor() {
    makeObservable(this, { vpnProps: observable });
  }

  getPlainProps() {
    const nprops = { ...this.vpnProps };
    return nprops;
  }
}

export const VPNPropStore = new VPNPropertiesImpl();
