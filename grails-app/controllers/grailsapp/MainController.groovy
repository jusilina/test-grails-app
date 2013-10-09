package grailsapp

import grails.converters.JSON

class MainController {


    def mainService

    def index = {
//        redirect(url: '/main/viewArchitecture')
        redirect(action: viewArchitecture)
    }

    def viewArchitecture = {

    }


    def getInfo (String objectId) {

        def object = [success: true];

        def findOblect = mainService.getModel(objectId);
        def data = [title: findOblect.name];

        if(findOblect instanceof Company)
        {
            data << [email: findOblect.email, description: findOblect.description];
        }
        else if (findOblect instanceof Person)
        {
            data  << [email: findOblect.mail, surname: findOblect.surname, loginName: findOblect.loginName, phone: findOblect.phone, birthday: findOblect.birthday.format('dd/MMM/yyyy')]
        }
        else
        {
            data << [description: findOblect.description];
        }


        object << [data:data]

        render object as JSON
    }

    def tree = {


        def companyList = []


        Company.list().each {

//            companyList << [text: it.name, description: it.description]
            def company = [text: it.name, id: it.name+'_cmp']

            def unitList = []
            def unitsCount = it.units.size();
            if (unitsCount == 0)
            {
                company << [leaf: true]
            }
            else
            {
                it.units.each {
                    def projectList = []
                    def projectCount = it.projects.size();
                    def unit = [text: it.name, id: it.name+'_unit']
                    if(projectCount == 0)
                    {
                        unit << [leaf: true]
                    }
                    else
                    {
                        it.projects.each {

                            def personCount = it.persons.size();
                            def project = [text: it.name, id: it.name+'_prj']
                            if(personCount == 0)
                            {
                                project << [leaf: true]
                            }
                            else
                            {
                                def personList = []

                                it.persons.each {
                                    personList << [text: it.name + ' '+ it.surname, id:project.id+it.loginName+'_prs', leaf: true]
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
