package grailsapp

class Company {

    static constraints = {
        name(blank: false)
        email(email: true, nullable: true)
        description(nullable: true)



    }

    String name
    String description
    String email
    static hasMany = [units:Unit]


}
