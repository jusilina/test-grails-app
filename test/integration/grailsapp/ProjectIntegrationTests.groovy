package grailsapp

import grails.test.GrailsUnitTestCase

import static org.junit.Assert.*
import org.junit.*

class ProjectIntegrationTests extends GrailsUnitTestCase{

    @Before
    void setUp() {
        // Setup logic here
    }

    @After
    void tearDown() {
        // Tear down logic here
    }


    void testFirstProject()
    {
        def company = new Company(name: "MERa", description: "TEST Comp")
        if(!company.save())
        {
            println "Validation errors on save"
            company.errors.each {
                println it
            }
        }
//        println(Company.list())


        def unit = new Unit ( name: 'BU MA', description: 'Mobile')
        company.addToUnits(unit)


        def project1 = new Project( name: 'APPS')
        unit.addToProjects(project1)

        def project2 = new Project( name: 'Android')
        unit.addToProjects(project2)

        assertEquals 2, unit.projects.size()


    }
}
