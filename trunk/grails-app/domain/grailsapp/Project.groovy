package grailsapp

class Project {

    String description
    String name

    static constraints = {
        name(blank: false)
        description(nullable: true)
    }

    static mapping = {
        sort name:"desc"
    }

    static  belongsTo = [unit : Unit]
    static  hasMany = [persons : Person]

}
