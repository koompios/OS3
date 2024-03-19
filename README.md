# KOOMPI OS3 Repository

Welcome to the KOOMPI OS3 repository! Here, you'll find everything related to KOOMPI OS3, including package builds, package sources, and the ISO builder.

## Branches

You can switch between different branches to tailor your KOOMPI OS3 experience. For example, if you want to build the KOOMPI OS3 KDE version ISO, you should switch to the KDE branch. Similarly, you can switch to the GNOME branch for the GNOME version ISO.

## Building KOOMPI OS3

To build KOOMPI OS3, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/koompios/OS3/
cd OS3
```
Checkout the branch you need. You can check our available branches to find the one that suits your requirements.
```bash
# Example
git checkout gnome-edition-x11
```
Use `mkarchiso` to create the ISO. Run the following command:
```bash
mkarchiso -v -o ./ iso-builder
```
