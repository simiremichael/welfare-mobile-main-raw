import { StatusBar } from "react-native";
import { MessageOptions } from "react-native-flash-message";
import { COLORS, TableRowType } from "../global/types";

export const States: string[] = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const successConfig: MessageOptions = {
  message: "Success",
  icon: "auto",
  type: "success",
  duration: 1500,
};

export const errorConfig: MessageOptions = {
  message: "Error",
  icon: "auto",
  type: "danger",
  duration: 3000,
};

export const infoConfig: MessageOptions = {
  message: "Success",
  icon: "auto",
  type: "info",
  duration: 1500,
};

export const colors: COLORS = {
  primary_main: "#432344",
  section_main: "#ff2525",
  input_secondary: "#ffc03d",
};

export const tableData: TableRowType[] = [
  {
    title: "Article 1",
    subTitle: "Aim of the Data Protection Policy",
    tableContent:
      "Kalyaan Welfare Consulting Limited (hereafter referred to as ‘Kalyaan Welfare’)  acknowledges that information technology should be at the service of every citizen.\n\nKalyaan Welfare acknowledges that information technology shall not violate human identity, human rights, privacy, or individual or public liberties.\n\nKalyaan Welfare is committed to maintaining globally accepted standards and principles of General Data Protection Regulation “GDPR”.\n\nKalyaan Welfare acknowledges that data protection is the foundation of trustworthy relationships and the reputation of Kalyaan Welfare as a credible organization.\n\nKalyaan Welfare Data Protection Policy is meant to be a practical and easy to understand document to which all Kalyaan Welfare’s client, departments, agencies stakeholders and partners can refer to.",
  },
  {
    title: "Article 2",
    subTitle: "Scope of the Data Protection Policy",
    tableContent:
      "This policy applies to all personal data processed by  Kalyaan Welfare.\n\nThis Data Protection Policy applies to all entities of Kalyaan Welfare, including networks and branch offices in all countries of operation.\n\nThe policy applies to all Kalyaan Welfare directors and staff.\n\nThe provision of this policy may also be applied to any person employed by an entity that carries out activities for and on behalf of Kalyaan Welfare.\n\nIn particular, this policy applies to implementing partners, suppliers, sub-grantees, stakeholders and other associated entities.\n\nKalyaan Welfare’s Data Protection Policy applies to all personal data that Kalyaan Welfare holds relating to identifiable individuals,\n\nmeaning any information relating to an identified or identifiable individual.",
  },
  {
    title: "Article 3",
    subTitle: "Data Protection Principles",
    tableContent:
      "Any person operating a device that deals with data shall take responsibility for Kalyaan Welfare’s ongoing compliance with this policy\n\n1. Fairness and Lawfulness:\n\n-When processing personal data, the individual rights of the data subjects must be protected. Personal data must be collected and processed in a legal and fair manner.\n\n- Collected data shall be adequate, relevant and not excessive in relation to the purposes for which they are obtained and their further processing.\n\n- Individual data can be processed upon voluntary consent of the person concerned.\n\n2. Restriction to a specific purpose:-\n\nPersonal data can be processed only for the purpose that was defined before the data was collected. Personal data shall be obtained for specified, explicit and legitimate purposes, and shall not subsequently be processed in a manner that is incompatible with those purposes. Subsequent changes to the purpose are only possible to a limited extent and require justification.\n\n- However, further data processing for statistical, scientific and historical purposes shall be considered compatible with the initial purposes of the data collection, if it is not used to take decisions with respect to the data subjects.\n\n3. Transparency:\n\nThe data subject must be informed of how his/her data is being handled. In general, personal data must be collected directly from the individual concerned. When the data is collected, the data subject must either be made aware of, or informed of:\n\n-  The purpose of data processing;\n\n- Categories of third parties to whom the data might be transmitted;\n\nProcessing of personal data must have received the consent of the data subject or must meet one of the following conditions: compliance with any legal obligation to which Kalyaan Welfare is subject; the performance of a public service mission entrusted to Kalyaan Welfare.\n\n4. Confidentiality and Data Security:\n\n- Personal data is subject to data secrecy. It must be treated as confidential on a personal level and secured with suitable organisational and technical measures to prevent unauthorised access, illegal processing or distribution, as well as accidental loss, modification or destruction.\n\n5. Deletion:\n\n- Personal data shall be retained in a form that allows the identification of the data subjects for a period no longer than is necessary for the purposes for which they are obtained and processed. There may be an indication of interests that merit protection or historical significance of this data in individual cases. If so, the data must remain on file until the interests that merit protection have been clarified legally, or the corporate archive has evaluated the data to determine whether it must be retained for historical purposes.\n\n6. Factual Accuracy and Up-to-datedness of Data:\n\n- Personal data on file must be correct, complete, and – if necessary – kept up to date. Suitable steps must be taken to ensure that inaccurate or incomplete data are deleted, corrected, supplemented or updated.",
  },
  {
    title: "Article 4",
    subTitle: "Kalyaan Welfare Set of Data",
    tableContent:
      "Set of Data herein referred to, means any information relating to a natural person who is or can be identified, directly or indirectly, by reference to an identification number or to one or more factors specific to his physical, physiological, mental, economic, cultural or social identity.\n\nThis can include in particular:\n- Names of individuals\n- Living addresses\n- Vehicle Registration numbers\n- Telephone numbers\n- Names of individuals next of kin\n- Living addresses of next of kin\n- Names of individuals family members\n- Living addresses of members\n- Identity card and passport\n- Date and place of birth\n- Identify of relatives \n- Fingerprints\n- Riders ID numbers",
  },
  {
    title: "Article 5",
    subTitle: "Processing of Data",
    tableContent:
      "Processing of personal data means any operation or set of operations in relation to such data, whatever the mechanism used, especially the obtaining, recording, organisation, retention, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, blocking, deletion or destruction, such data being stored at Amazon Web Services in the United States of America, the consent hereby granted by the person whose data is being collected.",
  },
  {
    title: "Article 6",
    subTitle: "Breach",
    tableContent:
      "In the event of a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data, Kalyaan Welfare shall promptly assess the risk to people’s rights and freedoms and if necessary and appropriate report this breach to the relevant authorities or institutions.",
  },
];
