package grailsapp

class Company {

    static constraints = {
        name(blank: false)
        description(nullable: true)


    }

    String name
    String description
    static hasMany = [units:Unit]
}
