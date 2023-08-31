# KOOMPIOS ISO build scripts
The KOOMPIOS build scripts are used to build the KOOMPIOS installation ISO images.

## Building the ISO
### 1. Install the build tools
```
sudo pacman -S archiso
```
### 2. Pull the repository
```
git clone https://github.com/KOOMPI-os/shifting.git
```
### 3. Build
```
cd shifting/build-tools
sudo mkarchiso -v -w workdir/ -o out/ .
```
Once the building process is finished you can find the ISO image in the `./out` directory.
### 4. Rebuilding the ISO
When building a second time you will have to remove the `./out` and `./workdir` directories.
```
sudo rm -rf ./out ./workdir
```

## Credits
This is based on Arkane Linux's ISO build scripts.



## Docker approach

docker build -t archiso-builder .

./run
