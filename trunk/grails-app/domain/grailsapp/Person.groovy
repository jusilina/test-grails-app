package grailsapp

class Person {

    static constraints = {
        loginName (blank: false, unique: true)
        password(blank: false, minSize: 3)
        name(blank: false)
        surname(blank: false)
        birthday(nullable: true)

        phone (maxSize: 12, nullable: true)
        mail(email: true, nullable: true)
    }
    String name
    String surname
    String mail
    String phone
    Date birthday
    String loginName
    String password


    static mapping = {
        sort loginName:"desc"
    }

    static hasMany = [projects: Project]
    static belongsTo = [Project]

    def beforeDelete()
    {
        Project.withNewSession {
            def projects = Project.findAll()
            projects.each {
                if (it.persons.contains(this))
                {
                    it.removeFromPersons(this)
                    it.save()
                    println('Delete '+getThisObject().name + ' from '+it.name)
                }
            }


        }

    }



}
