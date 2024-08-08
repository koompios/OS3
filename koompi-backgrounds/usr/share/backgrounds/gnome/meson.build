dataconf = configuration_data()
dataconf.set('BACKGROUNDDIR', backgrounddir)
dataconf.set('datadir', datadir)

backgrounds = ['koompi-default.webp',  'koompi-dark.webp']

install_data(backgrounds, install_dir: backgrounddir)

configure_file(input: 'koompip.xml.in',
    output: 'koompi.xml',
    configuration: dataconf,
    install: true,
    install_dir: metadatadir
  )
