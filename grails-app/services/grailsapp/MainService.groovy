package grailsapp

class MainService {
//    boolean transactional = true
    static final String companyId = '_cmp';
    static final String unitId = '_unt';
    static final String projectId = '_prj';
    static final String personId = '_prs';

    def removeObject(removeObjectId) {
        def model = getModel(removeObjectId);
        if (beforeDeleteAction(model)) {
            model.delete(flush: true)
        }
    }

    def messageSource

    def beforeDeleteAction(domain) {
        if (domain instanceof Person) {
            def person = domain

            def projects = Project.list()
            projects.each {
                if (it.persons.contains(person)) {
                    def project = it
                    try {
                        log.info 'Project: ' + project.name + ' contains person: ' + person.name

                        project.removeFromPersons(person)
                        log.info 'Person was removed from project'
                        project.save(flush: true)
                        log.info 'Delete ' + person.name + ' from ' + project.name
                    }
                    catch (Exception e) {
                        log.error(e.printStackTrace())
                        return false
                    }
                }

            }
        } else if (domain instanceof Project) {
            def project = domain
            def persons = Person.list()
            persons.each {
                if (it.projects.contains(project)) {
                    def person = it
                    try {
                        log.info 'Project: Delete: Find person ' + it.name
                        if (person.projects.size() == 1) {
                            log.info 'Project: Delete: Only in this project '
                            person.removeFromProjects(project)
                            person.delete(flush: true)
                        } else {
                            log.info 'Project: Delete: Also in other projects '
                            person.removeFromProjects(project)
                            person.save(flush: true)
                        }
                        log.info 'Project: Delete ' + project.name + ' and ' + person.name
                    }
                    catch (Exception e) {
                        log.error(e.printStackTrace())
                        return false
                    }

                }
            }

        } else if (domain instanceof Unit) {
            domain.projects.each {
                beforeDeleteAction(it)
            }
        } else if (domain instanceof Company) {
            domain.units*.projects.each {
                beforeDeleteAction(it)
            }
        }

        return true
    }


    def createObject(grailsParameterMap) {
        def status
        def success = true
        def msg = 'Component saved'
        def parent = grailsParameterMap.parent;
        def parentName
        if (null != parent) {
            if (parent.endsWith(companyId))  //Create unit
            {
                parentName = parent.minus(companyId)
                def company = Company.get(parentName);
                if (company) {
                    def unit = new Unit(name: grailsParameterMap.title, description: grailsParameterMap.description, company: company)
                    if (unit.validate()) {
                        company.addToUnits(unit)
                        company.save()
                        msg = 'Successfully created'

                    } else {
                        msg = getErrorMassages(unit)
                        success = false
                    }
                } else {
                    msg = parentName + 'not found'
                    success = false
                }
            } else if (parent.endsWith(unitId))     //Create project
            {
                parentName = parent.minus(unitId)
                def unit = Unit.get(parentName);


                if (unit) {
                    def project = new Project(name: grailsParameterMap.title, description: grailsParameterMap.description, unit: unit)
                    if (project.validate()) {
                        unit.addToProjects(project)
                        unit.save()
                        msg = 'Successfully created'

                    } else {
                        msg = getErrorMassages(project)
                        success = false
                    }

                } else {
                    msg = parentName + 'not found'
                    success = false
                }
            } else if (parent.endsWith(projectId))    //  Create person
            {
                parentName = parent.minus(projectId)
                def project = Project.get(parentName);

                if (project) {
                    def person = new Person(name: grailsParameterMap.title, surname: grailsParameterMap.surname, birthday: grailsParameterMap.birthday,
                            mail: grailsParameterMap.mail, loginName: grailsParameterMap.loginName, password: grailsParameterMap.password, phone: grailsParameterMap.phone)
                    if (person.validate()) {
                        project.addToPersons(person);
                        project.save();
                        msg = 'Successfully created'
                    } else {
                        msg = getErrorMassages(person)
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
            msg = 'Component not saved'
        }
        return status = [success: success, msg: msg]
    }

    def updateObject(grailsParameterMap) {
        def status
        def success = true
        def msg = 'Component updated'
        def idAndType = grailsParameterMap.id;
        def id
        def updateObject = getModel(idAndType)

        if (null != updateObject) {
            updateObject.properties = grailsParameterMap
            if (updateObject.validate()) {

                updateObject.save()

            } else {
                msg = updateObject.errors.allErrors.collect{
                    messageSource.getMessage(it, null)
                }
                success = false
            }

            if (updateObject instanceof Person)
            {
                def projId = grailsParameterMap.otherProject
                if(projId)
                {
                    Project pr = Project.get(projId)
                    pr.addToPersons(updateObject)

                    if (!pr.save())
                    {
                        msg = 'Person '+updateObject.name +' was not added to '+pr.name
                    }
                }
            }


        } else {
            success = false
            msg = 'Component not saved'
        }
        return status = [success: success, msg: msg]
    }

    def getModel(String objectId) {
        def findOblect
        def name

        if (objectId.endsWith(companyId)) {

            name = objectId.minus(companyId)
            findOblect = Company.get(name)
        } else if (objectId.endsWith(unitId)) {
            name = objectId.minus(unitId)
            findOblect = Unit.get(name)
        } else if (objectId.endsWith(projectId)) {
            name = objectId.minus(projectId)
            findOblect = Project.get(name)
        } else if (objectId.endsWith(personId)) {
            def (project, persName) = objectId.split(projectId)
            name = persName.minus(personId)
            findOblect = Person.get(name)
        }
        return findOblect

    }

    def getErrorMassages (object)
    {
        def msg = ''
        object.errors.allErrors.each{
            msg += messageSource.getMessage(it, null)
        }
        print msg

        return msg
    }
}
