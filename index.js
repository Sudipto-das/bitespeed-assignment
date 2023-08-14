const express = require('express')
const mongoose = require('mongoose')
const Contact = require('./database')
const app = express()
app.use(express.json())

mongoose.connect(
    "mongodb+srv://S_das:Sudipto123@cluster0.c1sttyl.mongodb.net/courses",
    {dbName:'bitespeed'}
  );

  app.post('/identify',async (req,res)=>{
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

  const port = 3000;
  app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
  })