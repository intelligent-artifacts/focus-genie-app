# focus-genie-app

This project consists of a genie genome and an HTML5 app.

Upload the genome to your Genie Factory at https://genie-factory.intelligent-artifacts.com, spawn a new bottle for the genie, and copy-paste the bottle's API interface into the app's main page where it says "Genie Interface".

This genie changes the direction of a vector based on context from strings.  The HTML5 app consists of a face representing the genie.  When something bad happens, like a bomb explodes or when the genie moves away from food, the genie gets a negative utility hit, i.e. 'scalar': [-100], and frowns.  When something good happens like it eats food or escapes a bomb, it gets a positive utility hit, 'scalar': [100], and smiles.

In short time, the genie learns to stay away from bombs and go get food.

Play around with the scalar value to change how quickly the genie learns this.  Add new items to the scene, or make things change their responses to the genie to see how the genie adapts in real-time.
