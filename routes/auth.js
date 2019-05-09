/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// POST is authorized
router.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const acceptTerms = req.body.acceptTerms;
  // eslint-disable-next-line no-useless-escape
  var regularMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email || !password || !passwordConfirm) {
    const fields = [];
    if(!email) fields.push('email')
    if(!password) fields.push('password')
    if(!passwordConfirm) fields.push('passwordConfirm')
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else if (!regularMail.test(email)){
    res.json({
      ok: false,
      error: 'Неверный формат Email!',
      fields: ['email']
    });
  } else if (password.length < 6) {
    res.json({
      ok: false,
      error: 'Слишком короткий пароль!',
      fields: ['password']
    });
  } else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: 'Пароли не совпадают!',
      fields: ['password', 'passwordConfirm']
    });
  } else if(acceptTerms != 'checked') {
    res.json({
      ok: false,
      error: 'Вы должны подтвердить, что согласны с правилами!'
    });
  } else {
    models.User.findOne({
      email
    }).then(user => {
      if (!user) {
        bcrypt.hash(password, null, null, (err, hash) => {
          models.User.create({
            email,
            password: hash
          })
            .then(user => {
              console.log(user);
              req.session.userId = user.id;
              req.session.userEmail = user.email;

              res.json({
                ok: true
              });
            })
            .catch(err => {
              console.log(err);
              res.json({
                ok: false,
                error: 'Ошибка, попробуйте позже!'
              });
            });
        });
      } else {
        res.json({
          ok: false,
          error: 'Email занят!',
          fields: ['email']
        });
      }
    });
  }
});

// POST is login
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //const rememberMe = req.body.rememberMe;

  if (!email || !password) {
    const fields = [];
    if(!email) fields.push('email')
    if(!password) fields.push('password')
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else {
    models.User.findOne({
      email
    }).then(user=> {
        if(!user) {
          res.json({
            ok: false,
            error: 'Неверный логин и пароль!',
            fields: ['email', 'password']
          });
        } else {
          bcrypt.compare(password, user.password, function(err,result) {
            if(!result) {
              res.json({
                ok: false,
                error: 'Неверный логин и пароль!',
                fields: ['email', 'password']
              });
            } else {
              req.session.userId = user.id;
              req.session.userEmail = user.email;
              res.json({
                ok: true
              });
            }
          });
        }
    })
    .catch(err => {
      console.log(err);
      res.json({
        ok: false,
        error: 'Ошибка, попробуйте позже!'
      });
    });
  }
});

// GET for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;