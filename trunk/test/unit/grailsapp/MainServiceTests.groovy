package grailsapp


import grails.test.*




//@TestFor(MainService)

class MainServiceTests extends GrailsUnitTestCase{
    def mainService
    MainServiceTests (){
        mainService = new MainService()
    }

    void testSuccessfulCreateObject() {

        def company = new Company(name: 'test', description: "TEST Comp")
        mockDomain(Company, [company])
        mockDomain(Unit)

        def saveUnit = [title: 'unit', description: 'descrUnit', parent: company.id +'_cmp'];
        def status = mainService.createObject(saveUnit)


        assertEquals(status.success, true)
    }

    void testUnSuccessfulCreateObject() {

        def company = new Company(name: 'test', description: "TEST Comp")
        mockDomain(Company, [company])
        mockDomain(Unit)

        def saveUnit = [description: 'descrUnit', parent: company.id + '_cmp'];
        def status = mainService.createObject(saveUnit)


        assertEquals(false, status.success)
        assertEquals(status.msg[0].endsWith('cannot be null'), true)

    }





}
