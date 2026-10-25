export type Status='In progress'|'Validated'|'Needs attention';
export type Idea={id:string;name:string;summary:string;status:Status;score:number;updated:string;audience:string;experiments:number;respondents:number};
export const initialIdeas:Idea[]=[
 {id:'idea-1',name:'Shared shopping lists',summary:'Help households coordinate recurring grocery trips without duplicate purchases.',status:'In progress',score:72,updated:'2 hours ago',audience:'Busy households',experiments:3,respondents:86},
 {id:'idea-2',name:'Quiet hours for teams',summary:'A lightweight way for distributed teams to protect focus time across time zones.',status:'Validated',score:89,updated:'Yesterday',audience:'Remote teams',experiments:5,respondents:214},
 {id:'idea-3',name:'Local repair marketplace',summary:'Make it easier to find trusted repairers for everyday appliances.',status:'Needs attention',score:41,updated:'3 days ago',audience:'Homeowners',experiments:2,respondents:38}
];
export const activity=[['Shared shopping lists','Survey received 24 new responses','2 hours ago','blue'],['Quiet hours for teams','Idea marked as validated','Yesterday','green'],['Local repair marketplace','Interview notes added by Maya Chen','3 days ago','purple']] as const;
