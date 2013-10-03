package grailsapp

class Unit {

    String description
    String name

    static constraints = {
        name(blank: false)
        description(nullable: true)
    }

    static  hasMany = [projects: Project]
    static belongsTo = [company: Company]

    static mapping = {
        sort name:"desc"
    }
}
