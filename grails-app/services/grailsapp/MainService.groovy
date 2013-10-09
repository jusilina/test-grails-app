package grailsapp

class MainService {
//    boolean transactional = true
    static final String companyId = '_cmp';
    static final String unitId = '_unit';
    static final String projectId = '_prj';
    static final String personId = '_prs';


    def getModel(String objectId) {
        def findOblect
        def name

        if (objectId.endsWith(companyId))
        {
            name = objectId.minus(companyId)
            findOblect = Company.findByName(name);
        }
        else  if (objectId.endsWith(unitId))
        {
            name = objectId.minus(unitId)
            findOblect = Unit.findByName(name);
        }
        else  if (objectId.endsWith(projectId))
        {
            name = objectId.minus(projectId)
            findOblect = Project.findByName(name);
        }
        else  if (objectId.endsWith(personId))
        {
            def (project, persName) = objectId.split(projectId)
            name = persName.minus(personId)
            findOblect = Person.findByLoginName(name);
        }
        return findOblect

    }
}
