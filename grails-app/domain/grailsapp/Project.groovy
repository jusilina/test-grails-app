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

    def beforeDelete()
    {
       Person.withNewSession {
          def persons = Person.list()
           persons.each {
               if (it.projects.contains(this))
               {
                   if(it.projects.size() == 1)
                   {
                       it.delete()
                   }
                   else
                   {
                       it.removeFromProjects(this)
                   }
                   println('Project: Delete '+getThisObject().name + ' and '+it.name)

               }
           }

       }

    }

}
