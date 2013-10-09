<%@ page import="grailsapp.Company" %>



<div class="fieldcontain ${hasErrors(bean: companyInstance, field: 'name', 'error')} required">
	<label for="name">
		<g:message code="company.name.label" default="Name" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="name" required="" value="${companyInstance?.name}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: companyInstance, field: 'description', 'error')} ">
	<label for="description">
		<g:message code="company.description.label" default="Description" />
		
	</label>
	<g:textField name="description" value="${companyInstance?.description}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: companyInstance, field: 'units', 'error')} ">
	<label for="units">
		<g:message code="company.units.label" default="Units" />
		
	</label>
	
<ul class="one-to-many">
<g:each in="${companyInstance?.units?}" var="u">
    <li><g:link controller="unit" action="show" id="${u.id}">${u?.encodeAsHTML()}</g:link></li>
</g:each>
<li class="add">
<g:link controller="unit" action="create" params="['company.id': companyInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'unit.label', default: 'Unit')])}</g:link>
</li>
</ul>

</div>

