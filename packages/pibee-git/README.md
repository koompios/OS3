<div align="center">
    <h1>pibee</h1>
</div>

<div align="center">
    <p>An installer framework and drop-in replacement for and rewrite of Jade in Python that uses the live session's file system instead of bootstrapping a new one, built for KOOMPIOS.</p>
</div>
## Testing

```sh
# 1. Clone this repository

git clone 'https://github.com/koompi-os/pibee'

# 2. Run the installer with the sample configuration in testing mode,
#    which will simply print out the commands that will run in a true
#    installation, instead of actually running them.

TESTING_INST=true ./pibee config 'sample-config.json'
```

### Error codes:

* `1` - Partitioning error
* `3` - Username not allowed

## Credits

Credit to developers from BlendOS, and also Crystal Linux
