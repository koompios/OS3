use std::process::Command;

fn main() {
    // Check if the CPU is being used
    let output = Command::new("top")
        .arg("-bn1")
        .output()
        .expect("Failed to execute command");
    let cpu_info = String::from_utf8_lossy(&output.stdout);
    let cpu_usage: f64 = cpu_info
        .lines()
        .find(|line| line.contains("Cpu(s)"))
        .and_then(|line| {
            let fields: Vec<&str> = line.split_whitespace().collect();
            fields.get(1).and_then(|&usage| usage.parse().ok())
        })
        .unwrap_or(0.0);
    let cpu_threshold: f64 = 20.0; // Adjust this threshold as needed

    // Check for idle CPU or hibernation
    if cpu_usage < cpu_threshold || is_sleep_active() {
        println!("Device is not actively used or in hibernation.");

        // Check internet connectivity
        if is_internet_connected() {
            println!("Device is connected to the internet. Checking for updates...");

            // Prompt for sudo password and check for updates
            if is_sudo_authenticated() {
                // Sudo authentication successful
                let updates = get_package_updates();

                // Check for new version of koompi-os
                if updates.contains("koompi-os") {
                    println!("New version of koompi-os found. Notifying user...");
                    notify_user("New version of KOOMPI OS available", "Please update to the latest version.");
                }

                println!("Syncing packages...");
                sync_packages();

                println!("Packages synced successfully.");
            } else {
                println!("Sudo authentication failed. Package sync cannot be performed.");
            }
        } else {
            println!("Device is not connected to the internet. Package sync cannot be performed.");
        }
    } else {
        println!("Device is actively used or not in hibernation. Skipping package sync.");
    }
}

fn is_sleep_active() -> bool {
    let output = Command::new("systemctl")
        .arg("is-active")
        .arg("sleep.target")
        .output()
        .expect("Failed to execute command");
    String::from_utf8_lossy(&output.stdout).trim() == "active"
}

fn is_internet_connected() -> bool {
    let output = Command::new("ping")
        .arg("-q")
        .arg("-c")
        .arg("1")
        .arg("-W")
        .arg("1")
        .arg("google.com")
        .output()
        .expect("Failed to execute command");
    output.status.success()
}

fn is_sudo_authenticated() -> bool {
    let output = Command::new("sudo")
        .arg("-v")
        .output()
        .expect("Failed to execute command");
    output.status.success()
}

fn get_package_updates() -> String {
    let output = Command::new("sudo")
        .arg("/usr/bin/pacman")
        .arg("-Qu")
        .arg("--noconfirm") // Add the --noconfirm flag
        .output()
        .expect("Failed to execute command");
    String::from_utf8_lossy(&output.stdout).to_string()
}

fn notify_user(title: &str, message: &str) {
    let _output = Command::new("notify-send")
        .arg(title)
        .arg(message)
        .output()
        .expect("Failed to execute command");
}

fn sync_packages() {
    let _output = Command::new("sudo")
        .arg("/usr/bin/pacman")
        .arg("-Sy")
        .arg("--noconfirm")
        .output()
        .expect("Failed to execute command");
}