FROM archlinux:latest

# Update package database and install required packages
RUN pacman -Syu --noconfirm archiso git base-devel wget curl gnupg dialog sudo bash-completion

# Set the working directory
WORKDIR /workdir

# Define entry point (optional)
CMD ["bash"]
