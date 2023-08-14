const express = require('express')
const mongoose = require('mongoose')
const Contact = require('./database')
const app = express()
app.use(express.json())

mongoose.connect(
    "mongodb+srv://S_das:Sudipto123@cluster0.c1sttyl.mongodb.net/courses",
    {dbName:'bitespeed'}
  );

  app.post('/order',async (req,res)=>{
    try{
        const {email,phone} = req.body
        const exsitingContact = await Contact.findOne({ $or: [{ email }, { phone }] })
        if(exsitingContact){
           
            await Contact.updateOne({_id:exsitingContact._id},{ linkPrecedence: 'primary' })
            const newSecondaryContact = new Contact({
                email,
                phone,
                linkedId:exsitingContact._id,
                linkPrecedence:'secondary'
            })
            await newSecondaryContact.save()
            res.status(200).json(newSecondaryContact)
        }
        else{
            const newPrimaryContact = new Contact({
                email,
                phone,
                linkPrecedence:'primary'
            })
            await newPrimaryContact.save()
            res.status(200).json(newPrimaryContact)
        }

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
  })


  app.post('/identify', async (req, res) => {
    const { email, phone } = req.body;
  
    try {
      const primaryContact = await Contact.findOne({
        email: email,
        phone: phone
      });
  
      if (!primaryContact) {
        return res.status(404).json({ message: "Primary contact not found." });
      }
  
      const secondaryContacts = await Contact.find({
        linkedId: primaryContact._id
      });
  const emails = [primaryContact.email, ...secondaryContacts.map(contact => contact.email)];

      const contact = {
        primaryContactId: primaryContact.id,
        emails: [emails],
        phoneNumbers: [primaryContact.phone],
        secondaryContactIds: secondaryContacts.map(contact => contact.id),
      };
  
      res.json({ contact });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  

  const port = 3000;
  app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
  })