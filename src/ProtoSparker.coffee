# require('coffee-script/register');

{SvgImporter} = require './importer/svgImporter'
{ProtoSparker, f, ff} = require './core/core'

exports.ProtoSparker = window.ProtoSparker = ProtoSparker
exports.SvgImporter = window.SvgImporter = SvgImporter
exports.f = window.f = f
exports.ff = window.ff = ff
