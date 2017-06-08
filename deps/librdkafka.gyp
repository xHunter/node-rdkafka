{
  'variables': {
    "WITH_SASL%": "<!(node ../util/has-lib.js sasl)",
    "WITH_LZ4%": "<!(node ../util/has-lib.js lz4)"
  },
  'targets': [
    {
      "target_name": "librdkafka_cpp",
      "type": "static_library",
      "include_dirs": [
        "librdkafka/src-cpp",
        "librdkafka/src"
      ],
      "dependencies": [
        "librdkafka"
      ],
      'sources': [
         '<!@(find librdkafka/src-cpp -name *.cpp)'
      ],
      "conditions": [
        [
          'OS=="linux"',
          {
            'cflags_cc!': [
              '-fno-rtti'
            ],
            'cflags_cc' : [
              '-Wno-sign-compare',
              '-Wno-missing-field-initializers',
              '-Wno-empty-body',
            ],
          }
        ],
        ['OS=="mac"', {
          'xcode_settings': {
            'OTHER_CFLAGS': [
              '-ObjC'
            ],
            'MACOSX_DEPLOYMENT_TARGET': '10.7',
            'GCC_ENABLE_CPP_RTTI': 'YES',
            'OTHER_CPLUSPLUSFLAGS': [
              '-std=c++11',
              '-stdlib=libc++'
            ],
            'OTHER_LDFLAGS': [],
          },
          'defines': [
            'FWD_LINKING_REQ'
          ]
        }]
      ]
    },
    {
      "target_name": "librdkafka",
      "type": "static_library",
      'defines': [],
      "include_dirs": [
        "librdkafka/src"
      ],
      'cflags': [
        '-Wunused-function',
        '-Wformat',
        '-Wimplicit-function-declaration'
      ],
      "conditions": [
        [
          'OS=="linux"',
          {
            'cflags!': [
            ],
            'cflags' : [
              '-Wno-type-limits',
              '-Wno-unused-function',
              '-Wno-maybe-uninitialized',
              '-Wno-sign-compare',
              '-Wno-missing-field-initializers',
              '-Wno-empty-body',
              '-Wno-old-style-declaration',
            ],
            "dependencies": []
          }
        ],
        [
          'OS=="mac"',
          {
            'xcode_settings': {
              'OTHER_CFLAGS' : [
                '-Wno-sign-compare',
                '-Wno-missing-field-initializers',
                '-ObjC',
                '-Wno-implicit-function-declaration',
                '-Wno-unused-function',
                '-Wno-format'
              ],
              'OTHER_LDFLAGS': [],
              'MACOSX_DEPLOYMENT_TARGET': '10.11',
              'libraries' : ['-lz']
            }
          }
        ],
        [
          'OS=="win"',
          {
            'msvs_settings': {
              'VCLinkerTool': {
                 'SetChecksum': 'true'
              }
            },
          }
        ],
        [ 'WITH_SASL=="true"',
          {
            'sources': [
              'librdkafka/src/rdkafka_sasl.c',
              'librdkafka/src/rdkafka_sasl_cyrus.c'
            ]
          }
        ],
        [ 'WITH_LZ4=="true"',
          {
            'sources': [
              'librdkafka/src/lz4.c',
              'librdkafka/src/lz4frame.c',
              'librdkafka/src/lz4hc.c'
            ]
          }
        ]
      ],
      'sources': [
         '<!@(find librdkafka/src -name *.c ! -name rdkafka_sasl* ! -name lz4* )'
      ],
      'cflags!': [ '-fno-rtti' ],
    }
  ]
}
