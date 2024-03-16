pkgname='pibee-git'
pkgver=0.1.0
pkgrel=1
pkgdesc='KOOMPI OS3 Installer Framework'
arch=(any)
depends=('squashfs-tools' 'arch-install-scripts' 'util-linux' 'parted')
provides=('pibee')
conflicts=('pibee')
source=('pibee-git::git+https://github.com/koompi-os/pibee-git')
sha256sums=('SKIP')

package() {
    cd "${srcdir}/pibee-git"
    install -Dm755 pibee -t "${pkgdir}/usr/bin/"
}
