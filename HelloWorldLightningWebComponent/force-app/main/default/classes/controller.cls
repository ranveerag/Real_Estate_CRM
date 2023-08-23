public with sharing class controller {
      @AuraEnabled(cacheable=true)
    public static List<Product2> getflatdetails(String location, String building, String block, String facing, String floor) {
        // System.debug('Location: ' + location);
        String debugAdj;
        List<Product2> products = [SELECT ProductCode, Locations__c, Building__c, Block__c, Facing__c, Floor__c, 
        Adjacent_Flat_Number__c	, Adjacent_Flat__c
            FROM Product2 
            WHERE Locations__c = :location
            AND Building__c = :building
            AND Block__c = :block
            AND Facing__c = :facing
            AND Floor__c = :floor
            // AND Availability__c = true
        ];
        
        // for (Product2 prod : products) {
        //     debugAdj = prod.Adjacent_Flat__r.ProductCode;
        //     System.debug('Adjacent Flat ProductCode: ' + debugAdj);
        // }
        
        return products;


}

@AuraEnabled(cacheable=true)
    public static List<Opportunity> fetchOptDetails(String optId) {
        return [select Locations__c, Buildings__c, Block__c, Facings__c, Floors__c from Opportunity where Id= :optId];
}

}