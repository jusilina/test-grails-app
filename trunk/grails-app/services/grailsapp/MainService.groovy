package grailsapp

class MainService {
//    boolean transactional = true
    static final String companyId = '_cmp';
    static final String unitId = '_unt';
    static final String projectId = '_prj';
    static final String personId = '_prs';
    def removeObject (removeObjectId){
        def model = getModel(removeObjectId);
        model.delete()

    }
    def saveObject(grailsParameterMap) {
        def status
        def success = true
        def msg = 'Component saved'
        def parent = grailsParameterMap.parent;
        def parentName
        if (null != parent) {
            if (parent.endsWith(companyId))  //Create unit
            {
                parentName = parent.minus(companyId)
                def company = Company.findByName(parentName);
                if (company) {
                    def unit = new Unit(name: grailsParameterMap.title, description: grailsParameterMap.description)
                    if (unit.validate())
                    {
                        company.addToUnits(unit)
                        company.save()
                        msg = 'Successfully created'

                    } else {
//                        company.discard()
                        msg = unit.errors.allErrors*.getDefaultMessage()
                        success = false
                    }
                } else {
                    msg = parentName + 'not found'
                    success = false
                }
            } else if (parent.endsWith(unitId))     //Create project
            {
                parentName = parent.minus(unitId)
                def unit = Unit.findByName(parentName);

                if (unit) {
                    def project = new Project(name: grailsParameterMap.title, description: grailsParameterMap.description)
                    if (project.validate())
                    {
                        unit.addToProjects(project)
                        unit.save()
                        msg = 'Successfully created'

                    } else {
                       // unit.discard()
                        msg = project.errors.allErrors*.getDefaultMessage()
                        success = false
                    }

                } else {
                    msg = parentName + 'not found'
                    success = false
                }
            } else if (parent.endsWith(projectId))    //  Create person
            {
                parentName = parent.minus(projectId)
                def project = Project.findByName(parentName);

                if (project) {
                    def person = new Person(name: grailsParameterMap.title, surname: grailsParameterMap.surname, birthday: grailsParameterMap.birthday, mail: grailsParameterMap.email, loginName: grailsParameterMap.loginName, password: grailsParameterMap.pass, phone: grailsParameterMap.phone)
                    if (person.validate() )
                    {
                        project.addToPersons(person) ;
                        project.save();
                        msg = 'Successfully created'
                    } else {
                        msg = person.errors.allErrors*.getDefaultMessage()
                        print msg
                        success = false
                    }
                } else {
                    msg = parentName + 'not found'
                    success = false
                }
            } else {
                success = false
                msg = 'Parent is not identified'
            }
        } else {
            success = false
        }
        return status = [success: success, msg: msg]
    }

    def getModel(String objectId) {
        def findOblect
        def name

        if (objectId.endsWith(companyId)) {
            name = objectId.minus(companyId)
            findOblect = Company.findByName(name);
        } else if (objectId.endsWith(unitId)) {
            name = objectId.minus(unitId)
            findOblect = Unit.findByName(name);
        } else if (objectId.endsWith(projectId)) {
            name = objectId.minus(projectId)
            findOblect = Project.findByName(name);
        } else if (objectId.endsWith(personId)) {
            def (project, persName) = objectId.split(projectId)
            name = persName.minus(personId)
            findOblect = Person.findByLoginName(name);
        }
        return findOblect

    }
}
