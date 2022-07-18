document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector("#compose-form").onsubmit = () => {
    send_email();
    return false;
  }

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`emails/${mailbox}`)
  .then((response) => response.json())
  .then((emails) => {
    
    emails.forEach((item) => {
      const email_div = document.createElement('div');
      email_div.style.display = 'block';
      email_div.style.borderStyle = 'solid';
      email_div.style.borderWidth = '1px';
      email_div.style.width = '100%';
      email_div.style.padding = '5px';
      email_div.addEventListener("click", () => view_email(item["id"]));

      let subject = document.createElement('p');
      subject.innerHTML = item['subject'];
      subject.style.display = 'inline-block';
      subject.style.marginLeft = '30px';

      let time = document.createElement('p');
      time.innerHTML = item['timestamp'];
      time.style.display = 'inline-block';
      time.style.float = 'right';

      if(mailbox === 'sent') {
        let recipients = document.createElement('strong');
        recipients.innerHTML = item['recipients'].join(", ") + " ";
        recipients.style.display = 'inline-block';

        email_div.append(recipients);
        email_div.append(subject);
        email_div.append(time);

      } else {
        let sender = document.createElement('strong');
        sender.innerHTML = item['sender'] + "\t";
        sender.style.display = 'inline-block';

        email_div.append(sender);
        email_div.append(subject);
        email_div.append(time);
      }

      if(item['read'] === true) {
        email_div.style.backgroundColor = 'rgb(197, 192, 192)';
      }

      document.querySelector('#emails-view').append(email_div);

    })

  })
  .catch((error) => console.log(error));
}

function view_email(email_id) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  document.querySelector('#email-view').innerHTML = '';
  
  fetch(`emails/${email_id}`)
  .then((response) => response.json())
  .then((email) => {
    
    let subject = document.createElement('div');
    let from = document.createElement('div');
    let to = document.createElement('div');
    let timestamp = document.createElement('div');
    let text = document.createElement('div');
    let hr = document.createElement('hr');
    let reply = document.createElement('button');

    from.innerHTML = `<strong>From:</strong> ${email['sender']}`;
    to.innerHTML = `<strong>To:</strong> ${email['recipients'].join(", ")}`;
    subject.innerHTML = `<strong>Subject:</strong> ${email['subject']}`;
    timestamp.innerHTML = `<strong>Timestamp:</strong> ${email['timestamp']}`;
    text.innerHTML = email['body'];

    reply.className = 'btn btn-primary';
    reply.innerHTML = 'Reply';
    reply.addEventListener('click', () => {
      reply.style.display = 'none';
      reply_email(email);
    });

    document.querySelector('#email-view').append(from);
    document.querySelector('#email-view').append(to);
    document.querySelector('#email-view').append(subject);
    document.querySelector('#email-view').append(timestamp);
    document.querySelector('#email-view').append(reply)
    document.querySelector('#email-view').append(hr);
    document.querySelector('#email-view').append(text);

  })
  .catch((error) => console.log(error));

  // Set the email to read.
  fetch(`/emails/${email_id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true
    })
  });
}

function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  console.log(recipients);
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
      .then(result => {
        if ("message" in result) {
            // The email was sent successfully!
            load_mailbox('sent');
        }

        if ("error" in result) {
            // There was an error in sending the email
            alert(result['error'])

        }
        console.log(result);
        console.log("message" in result);
        console.log("error" in result);
      })
        .catch(error => {
            console.log(error);
        });
  return false;
}

function reply_email(email) {
  const form = document.createElement('form');

  const form_div = document.createElement('div');

  const text_area = document.createElement('textarea');
  text_area.style.width = '60%';
  text_area.style.height = '100px';
  text_area.style.resize = 'none';
  text_area.style.display = 'block';
  text_area.style.marginTop = '40px';
  text_area.style.padding = '15px';
  text_area.autofocus = true;

  const send = document.createElement('button')
  send.innerHTML = 'Send';
  send.className = 'btn btn-primary'

  form.appendChild(text_area);
  form.appendChild(send);
  // form_div.appendChild(form);

  document.querySelector('#email-view').append(form);
  text_area,autofocus = true;

  form.addEventListener('submit', () => {
    
  });
}