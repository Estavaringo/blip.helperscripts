const getExtrasScripts = () => {
    return {
        "userName": "{{contact.name}}",
        "phoneNumber": "{{contact.phoneNumber}}",
        "perfilMovel": "{{mobileClientType}}",
        "lastTicketId": "{{lastTicketId}}",
        "message": "{{input.content}}",
        "origin": "{{lastState}}"
    }
}

module.exports.getExtrasScripts = getExtrasScripts