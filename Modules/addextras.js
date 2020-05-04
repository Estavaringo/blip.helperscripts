exports.addextrastoscripts = (function () {
	function ReplaceExtras(searchObject, extrasObj, deleteProperties, overwrite, overwriteAll) {
		Object.keys(searchObject).forEach(function (k) {
			var action = searchObject[k]
			if (action['type'] && action['type'] === 'TrackEvent') {
				if (Object.keys(action['settings']['extras']).length === 0 || overwriteAll) {
					action['settings']['extras'] = extrasObj
				}
				else {
					let currentExtras = action['settings']['extras'];
					action['settings']['extras'] = overwrite ? {...currentExtras, ...extrasObj} : {...extrasObj, ...currentExtras}
				}
			}

			try{
				if (deleteProperties) {
					for (const j in deleteProperties) {
						if (deleteProperties.hasOwnProperty(j)) {
							const prop = deleteProperties[j];
							if (action['settings']['extras'][prop]) {
								delete action['settings']['extras'][prop];
							}
						}
					}
				}
			}
			catch (ex) {
				
			}
		})
		return searchObject
	}
	return function (blipJson, deleteProperties, overwrite, overwriteAll) {
			try {
				var fs = require('fs')
				var extrasService = require('./../resources/extras')
				var extrasObj = extrasService.getExtrasScripts()
				Object.keys(blipJson).forEach(function (k) {
					var blipblock = blipJson[k]
					blipblock['$leavingCustomActions'] = ReplaceExtras(blipblock['$leavingCustomActions'], extrasObj, deleteProperties, overwrite, overwriteAll)
					blipblock['$enteringCustomActions'] = ReplaceExtras(blipblock['$enteringCustomActions'], extrasObj, deleteProperties, overwrite, overwriteAll)
				})

				return blipJson;
				
			} catch (error) {
				console.log(error)
			}
		}
	
})()