import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const TemplateGuide = () => (
  <Paper variant="outlined" sx={{ p: 3 }}>
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600}>
        Formatting guide
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Use markdown for structure and placeholders to inject client data dynamically. Common placeholders:
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="{{client.name}}" secondary="Client display name" />
        </ListItem>
        <ListItem>
          <ListItemText primary="{{client.primary_contact.email}}" secondary="Primary contact email" />
        </ListItem>
        <ListItem>
          <ListItemText primary="{{offer.total}}" secondary="Total amount for the current offer version" />
        </ListItem>
        <ListItem>
          <ListItemText primary="{{offer.items_table}}" secondary="Renders a table with all offer items" />
        </ListItem>
      </List>
      <Typography variant="body2" color="text.secondary">
        Tip: keep section headings consistent so your team can skim quickly. You can embed assets using markdown syntax:
        <code> ![Alt text](https://asset-url)</code>
      </Typography>
    </Stack>
  </Paper>
);

export default TemplateGuide;
