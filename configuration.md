Here's a complete and well-formatted README file for configuring and running your Laravel MQTT subscriber with Supervisor:

---

# MQTT Subscriber with Supervisor

This guide walks you through the process of configuring Supervisor to manage your Laravel MQTT subscriber application. It includes installation, setup, and verification steps.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Install Supervisor](#install-supervisor)
3. [Configure Supervisor for MQTT Subscriber](#configure-supervisor-for-mqtt-subscriber)
4. [Start and Manage the Service](#start-and-manage-the-service)
5. [Verify the Service](#verify-the-service)
6. [Log Files](#log-files)

## Prerequisites

## Note: This entire system is running on php 8.3, I tried changing php version and I hated my life for a minute.

Here you know the drill, -- composer install, after cloning the project.

Kati, this ka supervisor stuff will be helping us in managing the script that does the mqtt stuff, added it coz I needed to automate that process and besides in the config we have the power to make it restart the script in case of any network issues.

## Install Supervisor

If Supervisor is not installed on your system, I know you ain't got it, so follow these steps:

1. **Update your package list:**
   ```bash
   sudo apt update
   ```

2. **Install Supervisor:**
   ```bash
   sudo apt install supervisor
   ```

3. **Ensure that Supervisor service is running:**
   ```bash
   sudo systemctl start supervisor
   ```

4. **Enable Supervisor to start on system boot:**
   ```bash
   sudo systemctl enable supervisor
   ```

## Configure Supervisor for MQTT Subscriber

1. **Create a configuration file for your MQTT subscriber:**

   Navigate to the Supervisor configuration directory:
   ```bash
   cd /etc/supervisor/conf.d/
   ```

2. **Create the configuration file:**

   Create a new Supervisor configuration file:
   ```bash
   sudo nano mqtt-subscriber.conf
   ```

   So this is the ka config that we shall tell to manage our script in the project.

3. **Add the following configuration to the file:**

   ```ini
   [program:mqtt-subscriber]
   command=/usr/bin/php '/absolute/path/to/the/project'/artisan app:mqtt-subscriber  ; Command to run the MQTT subscriber
   autostart=true                       ; Automatically start when Supervisor starts
   autorestart=true                     ; Restart if the process crashes
   stderr_logfile=/var/log/mqtt-subscriber.err.log   ; Log file for errors
   stdout_logfile=/var/log/mqtt-subscriber.out.log  ; Log file for standard output
   user=aaronnevalinz                  ; User to run the command under
   numprocs=1                           ; Number of processes to run
   startsecs=5                          ; Time to wait before checking if the process has started
   startretries=3                       ; Number of retries if the process fails to start
   ```

4. **Save and close the file**.

## Start and Manage the Service

1. **Reread Supervisor configuration to recognize the new program:**
   ```bash
   sudo supervisorctl reread
   sudo supervisorctl update
   ```

2. **Start the MQTT subscriber service:**
   ```bash
   sudo supervisorctl start mqtt-subscriber
   ```

3. **To stop the service, use:**
   ```bash
   sudo supervisorctl stop mqtt-subscriber
   ```

4. **To restart the service, use:**
   ```bash
   sudo supervisorctl restart mqtt-subscriber
   ```

## Verify the Service

To verify that your MQTT subscriber is running properly, check the status:

```bash
sudo supervisorctl status
```

You should see output like this:

```
mqtt-subscriber               RUNNING    pid 12345, uptime 0:05:32
```

## Log Files

Supervisor will log the output of the MQTT subscriber to the following log files:

- **Standard Output Log:** `/var/log/mqtt-subscriber.out.log`
- **Error Output Log:** `/var/log/mqtt-subscriber.err.log`

Check these log files for troubleshooting or to verify the output of your MQTT subscriber.

### To view the logs:

1. **View the standard output log:**
   ```bash
   cat /var/log/mqtt-subscriber.out.log
   ```

2. **View the error output log:**
   ```bash
   cat /var/log/mqtt-subscriber.err.log
   ```

## Troubleshooting

- **If the process fails to start:**  
  Check the error log (`/var/log/mqtt-subscriber.err.log`) for any issues that may prevent the subscriber from running. Common issues might include missing dependencies or incorrect paths.

- **If the service stops unexpectedly:**  
  Review the `stdout` and `stderr` logs for any errors or exceptions, and ensure that the application has all necessary permissions to run under the specified user (`aaronnevalinz`).

---

Basically that's it. Supervisor is the only thing that we adding, and also it's purpose is that it automates the management of your background processes, ensuring that your MQTT subscriber keeps running, restarts automatically if it fails, and provides you with logs to monitor its performance.

To test you have to install mosquitto_cli, which will help you to test it on you machine, where you can publish data to that topic, and see for yourself how it is being saved to the database.

For instance: you can publish as below using mosquitto_cli

```
mosquitto_pub -h broker.hivemq.com -p 1883 -t iot/device12aaron -m  "{id:1,v:241.66,v_max:220.71,v_min:222.13,i:8.46,rpm:1462.71,eff:6.59,p_out:159.53,v_l1:246.38,v_l2:229.67,v_l3:242.03,v_p:229.89,p_s:192.69,t_amb:20.89,t:28.68,err:WOU484}"
```

I HOPE THIS HELPS YOU SET IT ALL UP.

AARON.