FROM py:36

# Set the working directory to /app
WORKDIR /opt/ciie_data

# Copy the current directory contents into the container at /app
COPY . /opt/ciie_data

# Install any needed packages specified in requirements.txt
#RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 5000

# Define environment variable
#ENV NAME World

# Run app.py when the container launches
CMD ["python3", "/opt/ciie_data/app.py"]