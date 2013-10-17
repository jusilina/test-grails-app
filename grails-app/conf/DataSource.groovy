dataSource {
    pooled = true
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory'
//    format_sql = true
    default_schema = "GRAILSDB"
}
// environment specific settings
environments {
    development {
        dataSource {
            driverClassName = 'oracle.jdbc.OracleDriver'
            url = 'jdbc:oracle:thin:@127.0.0.1:1521:XE'
            dbCreate = "update"
            username = "system"
            password = 'system'
            dialect = "org.hibernate.dialect.Oracle10gDialect"
//            logSql = true

            //  dbCreate = "update" // one of 'create', 'create-drop', 'update', 'validate', ''
//            url = "jdbc:h2:file:devDb;MVCC=TRUE;LOCK_TIMEOUT=10000"
        }
    }
    test {
        dataSource {
            dbCreate = "create"
            url = "jdbc:h2:mem:testDb;MVCC=TRUE;LOCK_TIMEOUT=10000;INIT=CREATE SCHEMA IF NOT EXISTS GRAILSDB"
        }
    }
    production {
        dataSource {
            dbCreate = "update"
            driverClassName = 'oracle.jdbc.OracleDriver'
            url = 'jdbc:oracle:thin:@127.0.0.1:1521:XE'
            dbCreate = "update"
            username = "system"
            password = 'system'
            dialect = "org.hibernate.dialect.Oracle10gDialect"
            //    url = "jdbc:h2:prodDb;MVCC=TRUE;LOCK_TIMEOUT=10000"
            pooled = true
            properties {
                maxActive = -1
                minEvictableIdleTimeMillis = 1800000
                timeBetweenEvictionRunsMillis = 1800000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1"
            }
        }
    }
}
