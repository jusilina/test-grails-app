package grailsapp

import grails.test.GrailsUnitTestCase
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap
import org.junit.After
import org.junit.Before

import static org.junit.Assert.assertEquals
import static org.junit.Assert.assertEquals

/**
 * Created with IntelliJ IDEA.
 * User: jusilina
 * Date: 11.10.13
 * Time: 10:58
 * To change this template use File | Settings | File Templates.
 */
class MainIntegrationTests extends GrailsUnitTestCase{
    def mainService

    @Before
    void setUp() {
        // Setup logic here
    }

    @After
    void tearDown() {
        // Tear down logic here
    }


    void testSuccessfulSaveObject()
    {
        def company = new Company(name: 'mera', description: "TEST Comp")
        assertNotNull company.save()



        def saveUnit = [title: 'unit', description: 'descrUnit', parent: company.id + '_cmp'];
        def status = mainService.createObject(saveUnit)

        assertEquals(status.success, true)
    }

    void testDeleteProject() {
        def company = new Company(name: 'test', description: "TEST Comp")
        assertNotNull company.save()


        def unit1 = new Unit(name: 'unit', description: 'descrUnit');
        company.addToUnits(unit1)
        company.save()

        def proj1 = new Project(name: 'proj1')
        def proj2 = new Project(name: 'proj2')

        unit1.addToProjects(proj1)
        unit1.addToProjects(proj2)
        unit1.save()

        assertEquals(2, unit1.projects.size())

        def pers1 = new Person(name: 'pers1', surname: 'surn1', loginName: 'pers1', password: 'pers1')
        def pers2 = new Person(name: 'pers2', surname: 'surn2', loginName: 'pers2', password: 'pers2')

        proj1.addToPersons(pers1)
        proj1.addToPersons(pers2)

        proj2.addToPersons(pers2)

        proj1.save()
        proj2.save()

        def deleteProject = proj1.id + "_prj"

        assertEquals(2, Project.list().size())
        assertEquals(2, Person.list().size())

        Project.withNewSession {
            mainService.removeObject(deleteProject)
        }

        assertEquals(1,Project.list().size())
        assertEquals(1, Person.list().size())
    }

}
