package grailsapp

import grails.converters.JSON

class MainController {


    def mainService

    def index = {
        redirect(url: "/main/viewArchitecture", params: params)
    }

    def viewArchitecture = {

    }


    def getInfo(String objectId) {

        def object = [success: true];

        def findOblect = mainService.getModel(objectId);
        def data = [title: findOblect.name];

        if (findOblect instanceof Company) {
            data << [mail: findOblect.email, description: findOblect.description];
        } else if (findOblect instanceof Person) {
            data << [mail: findOblect.mail, surname: findOblect.surname, loginName: findOblect.loginName, phone: findOblect.phone, parent: findOblect.projects.name, password: findOblect.password, birthday: findOblect.birthday]
            if (findOblect.birthday != null)
            {
                data <<  [birthday: findOblect.birthday.format('d/MM/yyyy')]
            }
        } else {
            data << [description: findOblect.description];
        }
        if (findOblect instanceof Unit)
        {
            data << [parent: findOblect.company.name];
        }
        if (findOblect instanceof Project)
        {
            data << [parent: findOblect.unit.name];
        }


        object << [data: data]

        render object as JSON
    }

    def saveObject = {
        def status = [success: false, msg: ''] ;
        if (null != params && !params.isEmpty()) {
            params << [name: params.title]
            if(params.birthday)
            {
                params.birthday = new Date().parse('d/M/yyyy', params.birthday)
            }
            if (params.exist.toBoolean()) {
                status = mainService.updateObject(params)
            } else {
                status = mainService.createObject(params)
            }
        }



       print 'saveObject method'

        render status as JSON

    }

    def allProjects ={
        def data = []
        if (params.prsId)
        {
            Person person = mainService.getModel(params.prsId);
            //def projectsList = Project.findAll('from Project p where p.id not in (select prs.projects from Person prs where prs.id = ?)',[person.id])//('from Project p where p.id not in (select project_id from PROJECT_PERSONS where person_id = ?)',[person.id])
        //    Company cmp = person.projects[0].unit.company
            def projectsList = Project.withCriteria {
                not {'in' ("id", person.projects*.getId())}
            }

            projectsList.each {
                data << [id: it.id, name: it.name]
            }

        }


        def status = [success: true, data: data] ;
        render status as JSON
    }



    def removeObject ={
        def status = [success: false] ;
        if (params?.parentId != null) {
            mainService.removeObject(params.parentId)
            status.success = true;
        }

        render status as JSON
    }

    def tree = {


        def companyList = []


        Company.list().each {

            def company = [text: it.name, id: it.id + '_cmp']

            def unitList = []
            def unitsCount = it.units.size();
            if (unitsCount == 0) {
                company << [leaf: true]
            } else {
                it.units.each {
                    def projectList = []
                    def projectCount = it.projects.size();
                    def unit = [text: it.name, id: it.id + '_unt']
                    if (projectCount == 0) {
                        unit << [leaf: true]
                    } else {
                        it.projects.each {

                            def personCount = it.persons.size();
                            def project = [text: it.name, id: it.id + '_prj']
                            if (personCount == 0) {
                                project << [leaf: true]
                            } else {
                                def personList = []

                                it.persons.each {
                                    personList << [text: it.name + ' ' + it.surname, id: project.id +it.id + '_prs', leaf: true]
                                }
                                project << [data: personList]
                            }
                            projectList << project

                        }
                        unit << [data: projectList]
                    }
                    unitList << unit
                }
                company << [data: unitList]
            }
            companyList << company

        }

        def companies = [data: companyList]

        render companies as JSON
    }

}
