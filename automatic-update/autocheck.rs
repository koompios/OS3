use std::process::Command;
use std::env;
use std::process::Stdio;

fn main() {
    // Get the command-line arguments
    let args: Vec<String> = env::args().collect();

    // Check for the desired commands
    if args.len() > 1 {
        let command = &args[1];

        match command.as_str() {
            "check" => {
                // Call the function for the 'autocheck' command
                autocheck();
            },
            "upgrade-now" => {
                // Call the function for the 'upgrade-now' command
                upgrade_now(true).unwrap();
            },
            _ => {
                // Handle other commands or show help
                println!("Unknown command: {}", command);
                println!("Available commands: autocheck, upgrade-now");
            }
        }
    } else {
        println!("No command provided.");
        println!("Available commands: check, upgrade-now");
    }
}

fn autocheck() {
    // Perform autocheck tasks
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
            println!("Device is connected to the internet.");
            println!("Checking for updates");

            // Prompt for sudo password and check for updates
            if is_sudo_authenticated() {
                // Sudo authentication successful
                let updates = get_package_updates();

                // Check for new version of koompi-os
                if updates.contains("koompi-os") {
                    println!("New version of koompi-os found. Notifying user...");
                    notify_user("New version of KOOMPI OS available", "Please update to the latest version.");
                    println!("Syncing packages...");
                    sync_packages();
                    println!("Packages synced successfully.");
                } else {
                    println!("No new version of KOOMPI OS found.");
                }
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
        .arg("--noconfirm")
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
        .arg("-Syyuw")
        .arg("--noconfirm")
        .output()
        .expect("Failed to execute command");
}

pub fn upgrade_now(overwrite: bool) -> Result<(), String> {
    println!("Upgrading system");

    let command = if overwrite {
        Command::new("pkexec")
            .arg("pacman")
            .arg("-Su")
            .arg("--needed")
            .arg("--noconfirm")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
    } else {
        Command::new("pkexec")
            .arg("pacman")
            .arg("-Su")
            .arg("--needed")
            .arg("--noconfirm")
            .arg("--overwrite=\"*\"")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
    };

    let mut stdout = String::from_utf8(command.as_ref().unwrap().stdout.clone()).unwrap();
    let stderr = String::from_utf8(command.as_ref().unwrap().stderr.clone()).unwrap();
    stdout.push_str(&stderr);

    // Check if the command exits with error
    if !command.as_ref().unwrap().status.success() {
        handle_update_errors(&stdout)?;
        upgrade_now(overwrite)?;
    } else {
        println!("Update completed");
    }

    Ok(())
}

fn handle_update_errors(stdout: &str) -> Result<(), String> {
    // Case: conflict files (files existing in the filesystem)
    if stdout.contains("exists in filesystem") {
        println!("Conflict files detected.");
        println!("Please resolve conflicts by choosing whether to overwrite or skip the conflicting files.");
        // Here you can choose to prompt the user to resolve the conflict
        // Or, automatically resolve the conflict by choosing to overwrite files
        return Err(String::from("File conflicts detected. Resolve them manually or consider using the overwrite option."));
    }

    // Case: conflict packages (packages that are in conflict)
    if stdout.contains("are in conflict") && stdout.contains("Remove") {
        println!("Conflict packages detected.");
        println!("Please resolve conflicts by removing or updating conflicting packages.");
        // Prompt the user to remove or update conflicting packages
        return Err(String::from("Package conflicts detected. Resolve them manually."));
    }

    // Case: invalid or corrupted packages (failed to commit transaction)
    if stdout.contains("Failed to commit transaction (invalid or corrupted package)") {
        println!("Failed to commit transaction due to invalid or corrupted package.");
        // Here you may want to take action to resolve the corrupted package issue
        return Err(String::from("Invalid or corrupted package found. Resolve manually or remove the corrupted package."));
    }

    // Case: unable to lock database (database lock issues)
    if stdout.contains("Failed to init transaction (unable to lock database)") {
        println!("Failed to init transaction due to database lock.");
        println!("Please ensure the database is unlocked.");
        // Automatically remove the database lock file if present
        Command::new("pkexec")
            .arg("rm")
            .args(&["/var/lib/pacman/db.lck"])
            .spawn()
            .map_err(|err| err.to_string())?;
        return Err(String::from("Database lock found and removed. Please try updating again."));
    }

    // Case: PGP signature error (GPG verification error)
    if stdout.contains("error: GPGME") || stdout.contains("invalid or corrupted package") {
        println!("GPG error detected.");
        println!("Please resolve GPG issues by refreshing keys or verifying package signatures.");
        // Take action to resolve GPG errors
        // Example: Refreshing keys
        Command::new("pkexec")
            .arg("pacman-key")
            .arg("--refresh-keys")
            .output()
            .map_err(|err| err.to_string())?;
        return Err(String::from("GPG error detected. Resolved by refreshing keys."));
    }

    // If no errors were found
    println!("No known errors detected.");
    Ok(())
}
