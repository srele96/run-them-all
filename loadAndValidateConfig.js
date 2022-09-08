const { cosmiconfig } = require('cosmiconfig');
const joi = require('joi');

// cosmiconfig https://github.com/davidtheclark/cosmiconfig/tree/v7.0.1
// joi https://github.com/hapijs/joi

// ----------------------------------------------------------------------------
// load configuration
// cosmiconfig uses module name to auto load/search
cosmiconfig(/* what should cosmiconfig name be? */'')
  // rely on cosmiconfig parser to spot invalid configuration
  .load(/* path to configuration */ '')
  .then(() => {
    // handle a couple of cases of:
    // empty non parsed configuration
    // empty parsed configuration (has comments)
    // if exists and not empty:
    //   - take result.config or {} because .yml with comment is not empty but has no value, so we assign default value
    //   - .json with {} is not empty and results in {}
    // else
    //   - what happened? do something constructive
  })
  .catch(() => {
    // handle errors
  });
// -------------------------------------------- -------------------------------

// -------------------------------------------- -------------------------------
// valid for anything
// https://stackoverflow.com/questions/6711971/regular-expressions-match-anything
const anyKey = new RegExp(/[\s\S]*/);
// ----------------------------------------------------------------------------

// -------------------------------------------- -------------------------------
// https://github.com/hapijs/joi/issues/679#issuecomment-118438716
// valid configuration has keys of type and with values of type string
const validConfiguration = joi.object().pattern(anyKey, joi.string().allow(''));
// -------------------------------------------- -------------------------------
