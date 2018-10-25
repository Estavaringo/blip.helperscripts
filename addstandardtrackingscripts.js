var addstandardtrackingscripts = function () {

	tagChooseAnswer = {}
	tagChooseAnswer['background'] = "#FFBC00"
	tagChooseAnswer['label'] = "ChooseAnswer"
	tagChooseAnswer['canChangeBackground'] = false;
	tagChooseAnswer['id'] = "blip-tag-ce6a9901-5a79-4096-9305-eb072c1e5e34";

	tagInputScripts = {}
	tagInputScripts['background'] = "#CCA2E1"
	tagInputScripts['label'] = "InputScripts"
	tagInputScripts['canChangeBackground'] = false;
	tagInputScripts['id'] = "blip-tag-8cc68c9d-bdf1-45ef-95b7-7824d8eef532";

	taglastStateUpdateEventScript = {}
	taglastStateUpdateEventScript['background'] = "#1FE5BD"
	taglastStateUpdateEventScript['label'] = "LastStateUpdateEventScript"
	taglastStateUpdateEventScript['canChangeBackground'] = false;
	taglastStateUpdateEventScript['id'] = "blip-tag-62d0f16e-9923-4f7d-b397-fb22de20d57c";
	try {
		var fs = require('fs')
		var enteringTrackingEvents = JSON.parse(fs.readFileSync('./resources/enteringTrackingEvents.json', 'utf8'))
		var jsonPath = process.argv[2]

		var blipJson = {}

		try {
			blipJson = JSON.parse(fs.readFileSync(jsonPath))
		} catch (error) {
			console.log(error)
		}

		if (!blipJson) {
			console.log('Unable to parse BlipJSON')
			return null
		}
		Object.keys(blipJson).forEach(function (k) {
			var blipblock = blipJson[k]
      var name = blipblock['$title'].substring(blipblock['$title'].search(" ")+1, blipblock['$title'].length)
      blipblock['$tags'] = []
      blipblock['$leavingCustomActions'] = []
			if (blipblock['$title'].search('\\[') != -1) {
				blipblock = AddInputScripts(blipblock, enteringTrackingEvents, name, k)
        var possibleAnswers = searchUserInput(blipblock)
        blipblock['$tags'].push(tagInputScripts)     
        if (possibleAnswers.length > 0) { //add only to interaction blocks         
          var possibleAnswersStr = JSON.stringify(possibleAnswers)
         

					var chooseAnswerScript = JSON.parse(fs.readFileSync('./resources/chooseAnswerScript.json', 'utf8'))
					var chooseAnswerEvent = JSON.parse(fs.readFileSync('./resources/chooseAnswerEvent.json', 'utf8'))
					chooseAnswerScript['settings']['source'] = chooseAnswerScript['settings']['source'].replace('#cs1#', possibleAnswersStr);
          blipblock = AddChooseAnswer(blipblock, chooseAnswerScript, name, chooseAnswerEvent)        
					blipblock['$tags'].push(tagChooseAnswer)
				}
        var lastStateUpdateEventScript = JSON.parse(fs.readFileSync('./resources/lastStateUpdateEventScript.json', 'utf8'))
        
				lastStateUpdateEventScript['settings']['source'] = lastStateUpdateEventScript['settings']['source'].replace('#LastState#', "\"" + name + "\"");
				blipblock['$leavingCustomActions'].push(lastStateUpdateEventScript)
				blipblock['$tags'].push(taglastStateUpdateEventScript)
			}

		})
		fs.writeFileSync('./output/ProcessedFileWithTrackingScripts.json', JSON.stringify(blipJson), {
			encoding: 'utf8',
			flag: 'w+'
		})
	} catch (error) {
		console.log(error)
	}
}

function AddInputScripts(selectedCard, enteringTrackingEvents, blockName, key) {
	enteringTrackingEvents[0]['settings']['category'] = blockName + "- laststate"
	enteringTrackingEvents[1]['settings']['category'] = blockName + "- origem"
	if (key != "onboarding")
		selectedCard['$enteringCustomActions'] = JSON.parse(JSON.stringify(enteringTrackingEvents))
	else {
		selectedCard['$enteringCustomActions'] = JSON.parse(JSON.stringify([enteringTrackingEvents[1]]))
	}
	return selectedCard
}

function AddChooseAnswer(selectedCard, chooseAnswerScript, blockName, chooseAnswerEvent) {
	chooseAnswerEvent['settings']['category'] = blockName + " cliques"
  selectedCard['$leavingCustomActions'] = JSON.parse(JSON.stringify([chooseAnswerScript, chooseAnswerEvent]))
	return selectedCard
}


function searchUserInput(searchObject) {
	var actions = searchObject['$contentActions']
	var possibleAnswers = []
	if (actions) {
		for (let index = 0; index < actions.length; index++) {
			const element = actions[index];

			if (element['action'] &&
				element['action']['settings'] &&
				element['action']['settings']['content'] &&
				element['action']['settings']['content']['options']) {
				for (let j = 0; j < element['action']['settings']['content']['options'].length; j++) {
					const element1 = element['action']['settings']['content']['options'][j];
					possibleAnswers.push(element1['text'])

				}
      }
      
      else if (element['action'] &&
				element['action']['settings'] &&
				element['action']['settings']['content'] &&
				element['action']['settings']['content']['items']) {
				for (let k = 0; k < element['action']['settings']['content']['items'].length; k++) {          
          const element2 = element['action']['settings']['content']['items'][k];
          if(element2['options']){
            for (let n = 0; n < element2['options'].length; n++) {
              const element3 = element2['options'][n];              
              if(element3['label']['type']=='text/plain'){
              
                possibleAnswers.push(element3['label']['value'])
              }
            }
          }
				}
			}


		}
  }
  
	return possibleAnswers
}



addstandardtrackingscripts()