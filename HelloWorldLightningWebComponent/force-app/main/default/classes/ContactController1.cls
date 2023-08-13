public with sharing class ContactController1 {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsBornBefore(Date birthDate) {
        return [SELECT Id, FirstName, LastName, Birthdate FROM Contact WHERE Birthdate < :birthDate];
    }
}