public class controllerRent {
  @AuraEnabled(cacheable=true)
  public static List<Rent__c> getRentId(String optId) {
      return [SELECT Id FROM Rent__c WHERE Opportunity_Name__c = :optId];
  }

  @AuraEnabled
    public static void createRentRecord(Id opportunityId) {
        Rent__c newRent = new Rent__c(Opportunity_Name__c = opportunityId);
        insert newRent;
    }

    @AuraEnabled
    public static void createOpportunityLineItem(Id opportunityId, Integer quantity, Id productId) {
        PricebookEntry pricebookEntry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Product2Id = :productId AND Pricebook2.IsStandard = true LIMIT 1];
    
        OpportunityLineItem newLineItem = new OpportunityLineItem(
            OpportunityId = opportunityId,
            Quantity = quantity,
            Product2Id = productId,
            PricebookEntryId = pricebookEntry.Id,
            TotalPrice = quantity * pricebookEntry.UnitPrice
        );
//System.debug('optID:' + opportunityId + 'productId: ' + productId + 'quant:' + quantity);
        insert newLineItem;
       // System.debug(newLineItem);
    }
  
}
