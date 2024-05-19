<h1 align="center">Arch Linux QEMU-KVM</h1>

### install all necessary packages
```
sudo pacman -S virt-manager virt-viewer qemu qemu-arch-extra \
edk2-ovmf vde2 ebtables dnsmasq bridge-utils openbsd-netcat libguestfs
```

### enable libvirt daemon
```
systemctl enable libvirtd.service
systemctl start libvirtd.service
```

### create bridge interface

`sudo nvim br10.xml`
```
<network>
  <name>br10</name>
  <forward mode='nat'>
    <nat>
      <port start='1024' end='65535'/>
    </nat>
  </forward>
  <bridge name='br10' stp='on' delay='0'/>
  <ip address='192.168.30.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.30.50' end='192.168.30.200'/>
    </dhcp>
  </ip>
</network>
```

### define and autostart network bridge
```
sudo virsh net-define br10.xml
sudo virsh net-start br10
sudo virsh net-autostart br10
```

### enable normal user account to use KVM

`sudo nvim /etc/libvirt/libvirtd.conf`
```
unix_sock_group = "libvirt"
unix_sock_ro_perms = "0777"
unix_sock_rw_perms = "0770"
```

### add current user to kvm and libvirt groups
```
sudo usermod -a -G kvm $(whoami)
sudo usermod -a -G libvirt $(whoami)
newgrp libvirt
```

### enable nested virtulization (optional)
```
sudo modprobe -r kvm_intel
sudo modprobe kvm_intel nested=1
echo "options kvm-intel nested=1" | sudo tee /etc/modprobe.d/kvm-intel.conf
```

### verify nested virtualization
```
systool -m kvm_intel -v | grep nested
cat /sys/module/kvm_intel/parameters/nested
```
